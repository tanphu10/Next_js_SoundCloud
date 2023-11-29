import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
  const url = new URL(request.url);
  // console.log(url);
  const searchParams = new URLSearchParams(url.search);

  const fileName = searchParams.get("audio");
  //  các bước xử lí back end thì chúng ta sẽ chỉnh sửa ở đây
  // console.log("check server", fileName);
  //   return Response.json({ data: "hỏi dân it" });
  let data = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${fileName}`
  );
  // console.log(data);
  return await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${fileName}`
  );
}
