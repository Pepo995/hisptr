import { useEffect, useState, useRef, useCallback } from "react";
import { Button, Label, Media, Modal, ModalBody } from "reactstrap";
import { dataURLtoFile } from "@components/Common/base64ToImageFile";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { toast } from "react-toastify";
import { SUPPORTED_IMAGE } from "@constants/ToastMsgConstants";
import { IMAGE_TOO_LARGE } from "@constants/ValidationConstants";

function ProfileImageCrop({ name, setImage, accept, croppedImage }) {
  const [upImg, setUpImg] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const [mime, setMime] = useState("");
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    aspect: 1,
  });
  const [modal, setModal] = useState(false);
  const togglemodal = () => setModal(!modal);

  const maxSizeBytes = 3 * 1024 * 1024; // 3MB in bytes

  /**
   * It takes the image file, checks if it's a supported image type, checks if it's too large, and if
   * it passes both checks, it sets the image to the state and opens the modal
   * @param e - The event object
   */
  const onSelectFile = (e) => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      if (image.type === "image/png" || image.type === "image/jpg" || image.type === "image/jpeg") {
        if (image.size > maxSizeBytes) {
          e.target.value = null;
          toast.error(IMAGE_TOO_LARGE(3));
        } else {
          setModal(true);
          setMime(image.type);
          const reader = new FileReader();
          reader.addEventListener("load", () => setUpImg(reader.result));
          reader.readAsDataURL(e.target.files[0]);
          e.target.value = null;
        }
      } else {
        e.target.value = null;
        toast.error(SUPPORTED_IMAGE);
      }
    }
  };

  /* A useCallback hook that is used to set the image to the imgRef.current. */
  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);
  /* This is a useEffect hook that is called when the completedCrop state is updated. It is used to
    draw the image on the canvas. */
  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY,
    );
  }, [completedCrop]);
  /**
   * It takes a canvas and a crop object, and returns a base64 image
   * @param canvas - The canvas element that is created by react-easy-crop
   * @param crop - The crop object that is returned from the onCropComplete function.
   * @returns A base64 string of the cropped image
   */
  function generateDownload(canvas, crop) {
    if (!crop || !canvas) {
      return;
    }
    canvas.toBlob(async (blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function() {
        const base64data = reader.result;
        croppedImage(base64data);
        setModal(!modal);
      };
      const fileReader = new FileReader();
      const file = await new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            fileReader.readAsDataURL(blob);
            fileReader.onloadend = () => {
              resolve(dataURLtoFile(fileReader.result, "profile_image"));
            };
          },
          mime,
          1,
        );
      });
      setImage(file);
    });
  }

  return (
    <>
      <div className="main-img tw-pb-3">
        <div className="d-flex">
          <div className="d-flex flex-column">
            <Button tag={Label} color="primary">
              Upload
              <input
                type="file"
                name={name}
                id="profileImage"
                onChange={onSelectFile}
                accept={accept}
                hidden
              />
            </Button>
          </div>
        </div>
      </div>
      <Media className="mr-25">
        <div className="upload-box">
          <div className="form-group preview">
            <Modal
              size="md"
              isOpen={modal}
              toggle={togglemodal}
              className="modal-dialog-centered cropped-modal"
            >
              <Button color="null" className="close-modal" onClick={togglemodal} />
              <ModalBody>
                <ReactCrop
                  src={upImg}
                  onImageLoaded={onLoad}
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                />
                <div>
                  <canvas ref={previewCanvasRef} style={{ width: 0, height: 0 }} />
                </div>
                <div className="text-center">
                  <button
                    className="btn btn-primary"
                    disabled={!completedCrop?.width || !completedCrop?.height}
                    onClick={() => generateDownload(previewCanvasRef.current, completedCrop)}
                  >
                    Set Image
                  </button>
                  &nbsp;
                  <Button
                    onClick={togglemodal}
                    className="f-700"
                    color="danger"
                    type="button"
                    outline
                  >
                    Cancel
                  </Button>
                </div>
              </ModalBody>
            </Modal>
          </div>
        </div>
      </Media>
    </>
  );
}

export default ProfileImageCrop;
