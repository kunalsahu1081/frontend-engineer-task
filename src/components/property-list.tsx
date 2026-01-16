import {useRef, useState} from "react";
import {IoMdArrowDropdown, IoMdArrowDropup} from "react-icons/io";
import Image from "next/image";
import {MdOutlineLocationOn} from "react-icons/md";

// There are several ways to implementation based on business use case
// if loading all data at once is not a concern then client side pagination
// if you need SEO load first page ssr than server side pagination rest of pages
// if SSR for the list does not matter than completely server side pagination

const PropertyList = ({initial_list, onPropertyClicked}) => {

    const pageNo = useRef(2);

    const [showLoadMore, setShowLoadMore] = useState(initial_list?.length >= 20);
    const [isLoading, setIsLoading] = useState(false);
    const [showPropertyList, setShowPropertyList] = useState(false);
    const [data, setData] = useState(initial_list);


    async function fetchProperties() {
        setIsLoading(true);
        const res = await fetch(`/property-listing/${pageNo.current}`, {});
        const json_data = await res.json();

        if (json_data.properties?.length > 0) {
            setData((prev) => [...prev, ...json_data.properties]);
            pageNo.current = pageNo.current + 1;
            if (json_data.properties?.length < 20) {
                setShowLoadMore(false)
            }
        }
        setIsLoading(false);
    }


    return <>

        <div
            className="w-[400px] max-h-[80vh] mt-[10vh] z-199 mb-auto ml-[100px] absolute bg-white left-[100px] top-0 overflow-hidden rounded-[16px] ">

            {
                <button
                    className={'w-[100%] p-[16px] bg-white text-black cursor-pointer  hover:bg-blue-50 text-[16px] font-bold flex items-center justify-between'}
                    onClick={() => setShowPropertyList((prev) => !prev)}
                >
                    All Properties

                    <div>

                        {showPropertyList ? <IoMdArrowDropup style={{height: '32px', width: '32px'}} />
                            : <IoMdArrowDropdown style={{height: '32px', width: '32px'}} />}

                    </div>
                </button>
            }

            <div
                className="max-h-[calc(80vh-100px)] bg-white overflow-y-auto rounded-[16px] ">

                {showPropertyList ?
                    data.map((item, index) => (
                        <PropertyItem key={item.id} property={item} onPropertyClicked={onPropertyClicked}/>
                    )) : null
                }

                {
                    showPropertyList && showLoadMore && !isLoading ? <button
                        className={'w-[100%] p-[16px] bg-white text-black cursor-pointer text-center hover:bg-blue-50 '}
                        onClick={() => fetchProperties()}>Load More</button> : null
                }

                {
                    isLoading ? <div
                        className={'w-[100%] p-[16px] bg-white text-black text-center  '}
                    >
                        Loading...
                    </div> : null
                }

            </div>

        </div>

    </>


}

const PropertyItem = ({property, onPropertyClicked}) => {

    return <>

        <div className={'p-[16px] bg-white text-black cursor-pointer hover:bg-blue-50 flex gap-[16px] border-t border-black '} role={"button"}
             onClick={() => {
                 onPropertyClicked(property);
             }}
        >

            <Image
                src={property.image}
                alt={property.alt}
                width={'100'}
                height={'120'}
                style={{ height: '120px', borderRadius: '8px' }}
                objectFit={'cover'}
            />

            <div  className={'flex-col gap-[8px]'}>

                <div className={'font-semibold text-[16px]'}>{property.name}</div>

                <div className={'flex items-center gap-[4px] text-[#6d6d6d]'}>
                    <MdOutlineLocationOn color={'#6d6d6d'} />
                    {property.micromarket},&nbsp;
                    {property.city}
                </div>

                <div className={' text-[#6d6d6d]'}>
                    {property.developerName}
                </div>

            </div>


        </div>

    </>

}

export default PropertyList;
