import {PropertyListing} from "@/data/property-listing";
import {Metadata} from "next";
import DiscoveryMapWrapper from "@/components/discovery-map-wrapper";


// this makes a page dynamic and generates ssr by default
// this practise should not be done and let the page be ssg or data driven ssr
// for data driven ssr fetch data asynchronously from the backend without caching ( if required ) other wise ssg
// adding below const only for the sake of assignment since not fetching anything in assignment from backend
export const dynamic = "force-dynamic";


// Static meta data
export const metadata: Metadata = {
    title: "Propsoch",
    description: "Buy your dream home confidently with Propsoch - Bangalore's smartest real estate service for home buyers to get expert advice, property insights & reports.",
    // custome meta data
    other: {
        "propsoch_meta": "Buy your dream home confidently "
    },
    // twitter
    twitter: {}
    // and others
};


// TODO: Create a List view for these properties.
// Use your own imagination while designing, please don't copy Propsoch's current UI.
// We don't like it either.
// Add pagination
// You can modify the Property Listing however you want. If you feel like creating an API and implementing pagination via that, totally your call.

export default async function Page() {
    return (
        <div className="w-screen h-screen relative">
            <DiscoveryMapWrapper allFilteredData={PropertyListing}/>
        </div>
    );
}
