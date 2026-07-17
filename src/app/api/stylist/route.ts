import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url)
    const stylistId = Number(searchParams.get('stylistId'))

    if(stylistId) {

      const { data, error } = await supabase.from("stylists").select("id,name,bio,image_url").eq('id', stylistId).single();

      if(error) {
        return NextResponse.json({ error: "コース情報取得に失敗しました"}, { status: 500 } );
      }

      console.log("data.name:", data.name)

      //json形式に変換して返す
      return NextResponse.json({ stylist: data ?? []});

    //topページから叩いたとき
    } else {

    const { data, error} = await supabase.from("stylists").select("id,name,bio,image_url");

    if(error) {
      console.error(error);
      return NextResponse.json({ error: "スタイリスト情報取得に失敗しました"}, { status: 500 } );
    }

    //json形式に変換して返す
    return NextResponse.json({ stylists: data ?? []});

  }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "例外的なエラーが発生しました"});
  }

}