import {NextRequest, NextResponse} from "next/server";


export default function Middleware(request: NextRequest) {
  return NextResponse.next()
}