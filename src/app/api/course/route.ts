import { createClient } from "@/lib/supabase/server";
import { Course } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {

    const supabase = await createClient();
    const { searchParams } = new URL(req.url)
    const courseId = Number(searchParams.get('courseId'));

    //reservationページから叩いたとき
    if(courseId) {

      const { data, error } = await supabase.from("courses").select("id,name,duration,price").eq('id', courseId).single();

      if(error) {
        return NextResponse.json({ error: "コース情報取得に失敗しました"}, { status: 500 } );
      }

      console.log("course取得:", data);

      //json形式に変換して返す
      return NextResponse.json({ course: data ?? []});

    //topページから叩いたとき
    } else {

      const { data, error } = await supabase.from("courses").select("id,name,duration,price");

      if(error) {
        return NextResponse.json({ error: "コース情報取得に失敗しました"}, { status: 500 } );
      }

      //json形式に変換して返す
      return NextResponse.json({ courses: data ?? []});
    
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "例外的なエラーが発生しました"});
  }

}