import {PencilIcon, TrashIcon, UploadIcon} from "@heroicons/react/outline";
import ImageUploading, { ImageListType } from "react-images-uploading";
import Layout from "@/components/layout";
import Navbar from "@/components/Navbar";
import {useState} from "react";
import {cn, urlEncName} from "@/lib/utils";
import {useRouter} from "next/router";
import {Roast} from "@prisma/client";
import useFetch from "@/lib/useFetch";
import PaymentPopup from "@/components/PaymentPopup";

export default function App() {
    const router = useRouter();
    const cFetch = useFetch();

    const [images, setImages] = useState<ImageListType>([]);
    const [buttonActive, setButtonActive] = useState<boolean>(true);
    const [createButtonText, setCreateButtonText] = useState<string>('Roast Me 🔥');
    const [openPaymentPopup, setOpenPaymentPopup] = useState<boolean>(false);
    const [roastData, setRoastData] = useState({
        name: ''
    })

    const maxNumber = 1;

    const onChange = (
        imageList: ImageListType,
        addUpdateIndex: number[] | undefined
    ) => {
        // data for submit
        console.log(imageList, addUpdateIndex);
        // setImages(imageList as never[]);

        imageList.forEach((image, index) => {
            setImages((prevImages) => {
                const newImages = [...prevImages];
                newImages[index] = image;
                return newImages;
            });
        })
    };

    const uploadFiles = async () => {
        if (!buttonActive) { return; }
        setCreateButtonText('Uploading Roastee...')

        if (images.length == 0) {
            setCreateButtonText('Roast Failed - Try Again')
            return;
        }

        const formData = new FormData();
        formData.append("name", roastData.name);
        formData.append("file", images[0].file as Blob);

        cFetch('/api/roast', {
            method: 'POST',
            body: formData,
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data: { success: boolean, roast?: Roast, message?: string }) => {
                    if (data.success && data.roast) {
                        setCreateButtonText('Roastee Uploaded!')
                        router.push(`/roast-of/${urlEncName(roastData.name)}/${data.roast.id}`)
                    }
                })
            } else if (res.status === 402) {
                setCreateButtonText('Roast Failed - 0 Roasts Left')
                setOpenPaymentPopup(true)
            } else {
                setCreateButtonText('Roast Failed - Try Again')
            }
        })
    };

    return (
        <>
            <Navbar />

            <Layout>
                <PaymentPopup open={openPaymentPopup} setOpen={setOpenPaymentPopup} />

                <main>
                    <div className={"flex flex-col items-center justify-center"}>
                        <div className={"flex flex-col items-center mt-10 sm:mt-24"}>
                            <div className={"flex flex-col mt-5 w-full"}>
                                <div className={"flex flex-row justify-between w-full"}>
                                    <div className={"flex flex-col w-full"}>
                                        <h2 className={"font-bold text-xl"}>Who are you roasting?</h2>
                                        <p className={"text-black/70"}>Make sure you have permission to roast them!</p>
                                    </div>
                                </div>

                                <div className={"mt-3"}>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <div className="mt-1 border-b border-gray-300 focus-within:border-indigo-600">
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            onChange={(e) => {
                                                setRoastData({
                                                    ...roastData,
                                                    name: e.target.value
                                                })
                                            }}
                                            className="block w-full border-0 border-b border-transparent bg-gray-50 focus:border-indigo-600 focus:ring-0 sm:text-sm"
                                            placeholder="Jane Doe"
                                        />
                                    </div>
                                </div>
                            </div>

                            <ImageUploading
                                multiple
                                value={images}
                                maxNumber={maxNumber}
                                onChange={onChange}>
                                {({
                                      imageList,
                                      onImageUpload,
                                      onImageRemoveAll,
                                      onImageUpdate,
                                      onImageRemove,
                                      isDragging,
                                      dragProps
                                  }) => (
                                    <div className="mx-5 w-full">
                                        <div className={"flex flex-col mt-5"}>
                                            <div className={"flex flex-row justify-between items-center"}>
                                                <div className={"flex flex-col"}>
                                                    <h2 className={"font-bold text-xl"}>Upload the Roastee</h2>
                                                    <p className={"text-black/70"}>Make sure the image is clear for optimal roasting.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div {...dragProps} onClick={onImageUpload} className="mt-5 cursor-pointer flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                            <div className="space-y-0 text-center">
                                                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex flex-col text-sm text-gray-600">
                                                    <button
                                                        style={isDragging ? { color: "red" } : undefined}
                                                    >
                                                        Click or Drop here
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={"flex flex-row justify-center"}>
                                            <div className={"flex flex-col justify-center items-center mt-5"}>
                                                {imageList.map((image, index) => (
                                                    <div key={index} className="image-item">
                                                        <img src={image.dataURL} alt="" className={"rounded-md object-cover w-auto h-48"} width={"550"} height={"550"} />
                                                        <div className="relative bottom-10 left-5">
                                                            <button onClick={() => onImageUpdate(index)}><PencilIcon className={"h-6 w-6 bg-black text-white p-1 rounded-md"} /></button>
                                                            <button onClick={() => onImageRemove(index)}><TrashIcon className={"h-6 w-6 bg-red-500 ml-2 text-white p-1 rounded-md"} /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </ImageUploading>
                        </div>

                        <button onClick={() => uploadFiles()} role="button" disabled={images.length == 0 || !roastData.name}>
                            <div className={cn((images.length == 0 || !roastData.name) ? "bg-gray-400" : "bg-orange-500", "inline-flex transition-all duration-150 h-12 w-full items-center justify-center gap-2 rounded-lg border border-transparent px-4 py-2 text-base font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 sm:w-auto")}>
                                {images.length !== 0 ? roastData.name ? createButtonText : "Roast Me 🔥 (name required)" : "Roast Me 🔥 (1 img required)"}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                        </button>
                    </div>
                </main>
            </Layout>
        </>
    )
}