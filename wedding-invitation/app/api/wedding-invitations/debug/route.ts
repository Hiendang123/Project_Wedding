import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("🔍 Debug - Request body:", JSON.stringify(body, null, 2));

    // Check required fields
    const { templateId, fields } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: "templateId is required" },
        { status: 400 }
      );
    }

    if (!fields || typeof fields !== "object") {
      return NextResponse.json(
        { error: "fields must be an object" },
        { status: 400 }
      );
    }

    // Check if required names exist in fields
    const groomName = fields["tên_chú_rể"];
    const brideName = fields["tên_cô_dâu"];

    console.log("🔍 Debug - Extracted names:", {
      groomName,
      brideName,
      allFields: Object.keys(fields),
    });

    if (!groomName || !brideName) {
      return NextResponse.json(
        {
          error: "Missing required names",
          details: {
            groomName: groomName || "missing",
            brideName: brideName || "missing",
            availableFields: Object.keys(fields),
          },
        },
        { status: 400 }
      );
    }

    // Success response
    return NextResponse.json({
      message: "Debug successful",
      data: {
        templateId,
        groomName,
        brideName,
        fieldsCount: Object.keys(fields).length,
        allFields: fields,
      },
    });
  } catch (error: any) {
    console.error("🔍 Debug error:", error);
    return NextResponse.json(
      { error: "Debug failed", details: error.message },
      { status: 500 }
    );
  }
}
