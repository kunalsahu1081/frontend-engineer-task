

// This route will run on the server and respond to HTTP GET requests

import {NextRequest} from "next/server";
import {PropertyListing} from "@/data/property-listing";

export async function GET(request: NextRequest, {params}) {

    try {

        // assuming default page size of 20

        const {page} = await params;


        if (isNaN(page)) {
            return Response.json(
                { error: "Invalid page number" },
                { status: 500 }
            );
        }

        const no_properties = PropertyListing.projects.length

        if (Number(page) > ( no_properties / 20 + (no_properties % 20 ? 1 : 0))) {
            return Response.json({ properties: []})
        }

        return Response.json({ properties: PropertyListing.projects.slice((page - 1) * 20, Math.min(page * 20, no_properties) )});


    } catch (e: any) {
        return Response.json(
            { error: e.message },
            { status: 500 }
        );
    }

    // Return JSON data
    return Response.json({ message: "Hello World from Next.js 16!" });
}
