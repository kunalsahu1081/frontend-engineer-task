"use client";

// TODO:  When zooming out, property nodes overlap and become cluttered.
// Improve visual spacing for a better UI/UX.

import "leaflet/dist/leaflet.css";
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css';
import "leaflet-defaulticon-compatibility";



import {JSX, useEffect, useRef, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {
    LayersControl,
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMap,
    useMapEvents,
} from "react-leaflet";

import {PropscoreRating} from "@/assets/PropsochRating";
import {
    cn,
    concatenateTypologies,
    formatDate,
    formatPrice,
    para,
} from "@/utils/helpers";
import {BudgetIcon} from "@/assets/budget-icon";
import {HouseIcon} from "@/assets/house-icon";
import {LocationIcon} from "@/assets/location-icon";
import {CalendarIcon} from "@/assets/utility";
import L, {Map as LeafletMap, Marker as LeafletMarker} from "leaflet";
import {LocationType, projectListing} from "@/types/types";
import {Badge} from "./badge";
import {renderToString} from "react-dom/server";
import dynamic from "next/dynamic";
import {MarkerIcon} from "@/assets/marker-icon";

const MarkerClusterGroup = dynamic(() => import("react-leaflet-cluster"), {
    ssr: false,
});

interface Location {
    lat: number;
    lon: number;
    name: string;
}

export const renderIcon = (
    icon: JSX.Element,
    ariaLabel: string,
    transform = "translate(-8px, -4px)"
) =>
    `<div style="transform: ${transform}" aria-label="${ariaLabel}" role="button">${renderToString(
        icon
    )}</div>`;

function getOtherLocationIcon(
    project: projectListing,
    isSelected: boolean,
): L.DivIcon {
    return L.divIcon({
        html: renderIcon(
            <div className={'flex flex-col items-center justify-center gap-[4px]'}>
                <MarkerIcon color={'red'} />
                <Badge variant={"white"} className="w-max whitespace-nowrap">
                    {project.name}
                </Badge>,
            </div>,
            project.name,
            isSelected ? "translate(-10px, -20px)" : "translate(-15px, -20px)"
        ),
    });
}

function MapClickHandler({onClick}: { onClick: (latlng : {lat: number, lon: number}) => void }) {
    useMapEvents({
        click: (position) => onClick({lat: position.latlng.lat, lon: position.latlng.lng}),
    });
    return null;
}


function MapController({
                           selectedLocation,

                       }: Readonly<{
    selectedLocation: LocationType | null;

}>) {
    const map = useMap();

    useEffect(() => {
        if (selectedLocation) {
            map.flyTo(
                [selectedLocation.lat, selectedLocation.lon],
                16,
                {
                    animate: true,
                    duration: 1.5,
                }
            );
            // map.setZoom(14);
            // map.panTo([selectedLocation.lat, selectedLocation.lon], {
            //     animate: true,
            //     duration: 1.5,
            // });
            // setTimeout(() => {
            //     map.setZoom(16);
            // }, 2000)
            // map.zoomIn(1);
        }
    }, [selectedLocation, map]);

    return null;
}

export default function DiscoveryMap({
                                         allFilteredData,
                                         listSelectedLocation,
                                     }: Readonly<{ allFilteredData: any, listSelectedLocation: projectListing | null; }>) {
    const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(
        null
    );
    const sectionRef = useRef(null);
    const [selectedProperty, setSelectedProperty] = useState<projectListing | null>(null);

    // useEffect(() => {
    //     if (selectedLocation) {
    //         const found = allFilteredData.projects.find(
    //             (prop: projectListing) => prop.name == selectedLocation.name
    //         );
    //         setSelectedProperty(found);
    //         const el = document.querySelector(
    //             `[data-marker-id="${selectedLocation.name}"]`
    //         ) as HTMLElement | null;
    //         if (el) {
    //             el.scrollIntoView({behavior: "smooth", block: "nearest"});
    //         }
    //     }
    // }, [selectedLocation]);

    const onMarkerClicked = (project: projectListing) => {

        setSelectedLocation({lat: project.latitude, lon: project.longitude});
        setSelectedProperty(project);

    }

    useEffect(() => {
        if (listSelectedLocation) {
            onMarkerClicked(listSelectedLocation);
        }
    }, [listSelectedLocation]);

    return (
        <section
            ref={sectionRef}
            style={{fontFamily: "Arial, sans-serif"}}
            className="flex aspect-auto h-full flex-col gap-4 overflow-hidden"
            aria-label={`Project discovery via map`}
        >
            {/* Map Container */}
            <div className="relative size-full overflow-hidden">
                <MapContainer
                    center={[12.97, 77.59]}
                    zoom={12}
                    scrollWheelZoom={true}
                    dragging={true}
                    touchZoom={true}
                    className="border-lightborder z-10 size-full rounded-lg border object-cover"
                    aria-label="Map view"
                >
                    <LayersControl position="bottomleft">
                        {/* Street View */}
                        <LayersControl.BaseLayer checked name="Street View">
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </LayersControl.BaseLayer>

                        {/* Satellite View (Esri) */}
                        <LayersControl.BaseLayer name="Satellite View">
                            <TileLayer
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>
                    <MapClickHandler onClick={(latlng) => {
                        setSelectedLocation(latlng);
                        setSelectedProperty(null);
                    }}/>
                    <MapController selectedLocation={selectedLocation}/>

                    {/* Project Location Marker */}

                    <MarkerClusterGroup>
                        {allFilteredData && allFilteredData.projects.length > 0
                            ? allFilteredData.projects.map((project: projectListing) => (
                                <Marker
                                    position={[project.latitude, project.longitude]}
                                    key={project.id}
                                    eventHandlers={{
                                        click: () => {
                                            onMarkerClicked(project);
                                        }
                                    }}
                                    icon={getOtherLocationIcon(
                                        project,
                                        selectedProperty?.id == project.id,
                                    )}
                                />
                            ))
                            : null}
                    </MarkerClusterGroup>

                    {selectedProperty && (
                        <Popup
                            position={[selectedProperty.latitude, selectedProperty.longitude]}
                            autoClose={false}
                            closeOnClick={false}
                            offset={[0, -20]}
                            closeOnEscapeKey
                            minWidth={400}
                            closeButton
                        >
                            <Link
                                href={`/property-for-sale-in/${selectedProperty.city.toLowerCase()}/${selectedProperty.slug.toLowerCase()}/${
                                    selectedProperty.id
                                }`}
                                target="_blank"
                            >
                                <div className="flex w-full flex-col gap-3">
                                    <Image
                                        src={selectedProperty.image}
                                        alt={selectedProperty.alt}
                                        width={500}
                                        height={500}
                                        loading="lazy"
                                        className={cn(
                                            "aspect-video size-full rounded-lg object-cover transition-all duration-400 ease-in-out",
                                            selectedProperty.projectStatus === "soldOut" &&
                                            "grayscale"
                                        )}
                                    />
                                    <h3
                                        className={cn(
                                            para({size: "lg", color: "dark"}),
                                            "font-semibold"
                                        )}
                                    >
                                        {selectedProperty.name}
                                    </h3>

                                    <div className="flex flex-col gap-3 whitespace-nowrap">
                                        <div className="flex w-full items-center justify-between">
                      <span
                          className={cn(
                              para({color: "dark", size: "sm"}),
                              "flex w-full items-center gap-2"
                          )}
                      >
                        <LocationIcon width={20} height={20}/>
                        <span>{selectedProperty.micromarket}</span>
                      </span>
                                            <span
                                                className={cn(
                                                    para({color: "dark", size: "sm"}),
                                                    "flex w-full items-center justify-end gap-2"
                                                )}
                                            >
                        <PropscoreRating
                            rating={selectedProperty.propscore}
                            width={110}
                            height={24}
                            className={"ml-auto w-max max-w-40"}
                        />
                      </span>
                                        </div>
                                        <div className="flex w-full items-center justify-between gap-3">
                      <span
                          className={cn(
                              para({color: "dark", size: "sm"}),
                              "flex w-full max-w-40 items-center gap-2 truncate"
                          )}
                      >
                        <BudgetIcon width={20} height={20}/>
                          {formatPrice(selectedProperty.minPrice, false)} -{" "}
                          {formatPrice(selectedProperty.maxPrice, false)}
                      </span>
                                            <span
                                                className={cn(
                                                    para({color: "dark", size: "sm"}),
                                                    "flex w-full items-center justify-end gap-2"
                                                )}
                                            >
                        <CalendarIcon height={20} width={20}/>
                                                {formatDate(selectedProperty.possessionDate)}
                      </span>
                                        </div>
                                        <div className="flex w-full items-center justify-between gap-3">
                      <span
                          className={cn(
                              para({color: "dark", size: "sm"}),
                              "flex w-full max-w-40 items-center gap-2 truncate"
                          )}
                      >
                        <HouseIcon width={20} height={20}/>
                        <span className="w-32 max-w-32 truncate">
                          {concatenateTypologies(selectedProperty.typologies)}
                        </span>
                      </span>
                                            <span
                                                className={cn(
                                                    para({color: "dark", size: "sm"}),
                                                    "flex w-full items-center justify-end gap-2"
                                                )}
                                            >
                        {selectedProperty.minSaleableArea} -{" "}
                                                {selectedProperty.maxSaleableArea} sqft
                      </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </Popup>
                    )}
                </MapContainer>
            </div>
        </section>
    );
}
