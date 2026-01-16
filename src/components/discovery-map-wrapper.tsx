
"use client"
import dynamic from "next/dynamic";
import {useState} from "react";
import PropertyList from "@/components/property-list";
import {projectListing} from "@/types/types";


const DiscoveryMap = dynamic(() => import("@/components/discovery-map"), {
    ssr: false,
}) ;


const DiscoveryMapWrapper = ({allFilteredData}: {allFilteredData: any})  => {

    const [listSelectedLocation, setListSelectedLocation] = useState<projectListing | null>(null);


    return <>

        <DiscoveryMap allFilteredData={allFilteredData} listSelectedLocation={listSelectedLocation} />
        <PropertyList initial_list={allFilteredData.projects.slice(0, 20)} onPropertyClicked={(property) => setListSelectedLocation(property)} />

    </>

}

export default DiscoveryMapWrapper;
