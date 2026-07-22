-- create_reservation / update_reservation
--
-- 予約の作成・変更をアトミックに行うRPC。pg_advisory_xact_lockでuser_id単位に排他し、
-- フリー（指名なし）予約時は空いている有効なスタイリスト（is_delete = false）を
-- ランダムに自動割当する。重複予約の最終防衛はreservationsテーブルの
-- EXCLUDE制約（no_overlap_reservations）が担う。
--
-- 本ファイルはSupabaseダッシュボード（本番）の定義を
-- `select pg_get_functiondef('public.create_reservation'::regproc);` /
-- `select pg_get_functiondef('public.update_reservation'::regproc);`
-- で取得した内容をそのまま反映したもの。関数を変更したら、本番に反映後
-- 必ずこのファイルも同じ内容に更新すること。

CREATE OR REPLACE FUNCTION public.create_reservation(p_target_date date, p_new_start time without time zone, p_new_end time without time zone, p_course_id bigint, p_stylist_id bigint, p_user_id uuid)
 RETURNS reservations
 LANGUAGE plpgsql
AS $function$declare
  inserted_row reservations%rowtype;
begin

  -- user_idでロック
  perform pg_advisory_xact_lock(hashtext(p_user_id::text));

  --未来日の予約レコード存在チェック
  if exists (
    select 1 from reservations
    where user_id = p_user_id
    and reserv_date >= current_date
    and is_canceled = false
  ) then
    raise exception 'すでに予約があります';
  end if;

  if p_stylist_id is null then
    insert into reservations (
      reserv_date,
      reserv_time_st,
      reserv_time_ed,
      course_id,
      stylist_id,
      user_id,
      is_free
    )
    select
      p_target_date,
      p_new_start,
      p_new_end,
      p_course_id,
      s.id,
      p_user_id,
      true
    from stylists s
    where s.is_delete = false
     and not exists (
      select 1 from reservations r
      where r.stylist_id = s.id
      and r.reserv_date = p_target_date
      and r.reserv_time_st < p_new_end
      and r.reserv_time_ed > p_new_start
      and r.is_canceled = false
    )
    order by random()
    limit 1
    returning * into inserted_row;

  else
    insert into reservations (
      reserv_date,
      reserv_time_st,
      reserv_time_ed,
      course_id,
      stylist_id,
      user_id,
      is_free
    )
    select
      p_target_date,
      p_new_start,
      p_new_end,
      p_course_id,
      p_stylist_id,
      p_user_id,
      false
    from (select 1) as dummy
    where not exists (
      select 1 from reservations r
      where r.stylist_id = p_stylist_id
      and r.reserv_date = p_target_date
      and r.reserv_time_st < p_new_end
      and r.reserv_time_ed > p_new_start
      and r.is_canceled = false
    )
    returning * into inserted_row;

  end if;

  if inserted_row is null then
    raise exception '空きがありません';
  end if;

  return inserted_row;

end;$function$
;

CREATE OR REPLACE FUNCTION public.update_reservation(p_id bigint, p_target_date date, p_new_start time without time zone, p_new_end time without time zone, p_course_id bigint, p_stylist_id bigint, p_user_id uuid, p_version integer)
 RETURNS reservations
 LANGUAGE plpgsql
AS $function$declare
  inserted_row reservations%rowtype;
  v_stylist_id bigint;
begin

  perform pg_advisory_xact_lock(hashtext(p_user_id::text));

  -- フリー or 指名で分岐
  if p_stylist_id is null then

    select s.id into v_stylist_id
    from stylists s
    where s.is_delete = false
      and not exists (
        select 1 from reservations r
        where r.stylist_id = s.id
          and r.reserv_date = p_target_date
          and r.reserv_time_st < p_new_end
          and r.reserv_time_ed > p_new_start
          and r.is_canceled = false
      )
    order by random()
    limit 1;

    if v_stylist_id is null then
      raise exception '空きがありません';
    end if;

  else
    v_stylist_id := p_stylist_id;
  end if;

  -- 更新（楽観ロック付き）
  update reservations
  set
    reserv_date = p_target_date,
    reserv_time_st = p_new_start,
    reserv_time_ed = p_new_end,
    course_id = p_course_id,
    stylist_id = v_stylist_id,
    user_id = p_user_id,
    version = p_version + 1
  where id = p_id
    and user_id = p_user_id
    and reserv_date >= current_date
    and is_canceled = false
    and version = p_version
  returning * into inserted_row;

  if inserted_row is null then
    raise exception '更新に失敗しました（version不一致 or 条件NG）';
  end if;

  return inserted_row;

exception
  when exclusion_violation then
    raise exception 'その時間は予約できません';
end;$function$
;
