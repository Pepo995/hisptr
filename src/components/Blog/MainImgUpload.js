import { useEffect, useState, useRef, useCallback } from "react";
import { Button, Input, InputGroup, Label, Media, Modal, ModalBody } from "reactstrap";
import { dataURLtoFile } from "@components/Common/base64ToImageFile";
import ReactCrop from "react-image-crop";
import { toast } from "react-toastify";
import { SUPPORTED_IMAGE, TEN_MB_IMAGE } from "@constants/ToastMsgConstants";
function MainImgUpload({ setImage, accept, url }) {
  const [imageFile, setImageFile] = useState(null);
  const [cropImage, setCropImage] = useState("");
  const [upImg, setUpImg] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const [mime, setMime] = useState("");
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({
    unit: "%", // Can be 'px' or '%'
    aspect: 16 / 7,
    x: 160,
    y: 70,
    width: 500,
    height: 500,
  });
  const [modal, setModal] = useState(false);
  const togglemodal = () => setModal(!modal);

  /**
   * It takes the image file, checks if it's a supported image type, checks if it's less than 10MB, and
   * if it is, it sets the state of the modal to true, sets the mime type of the image, and sets the
   * image to the state
   * @param e - The event object
   */
  const onSelectFile = (e) => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      if (image.type === "image/png" || image.type === "image/jpg" || image.type === "image/jpeg") {
        if (image.size > 10000000) {
          e.target.value = null;
          toast.error(TEN_MB_IMAGE);
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

  /* A useCallback hook that is called when the image is loaded. It is used to set the image to the
  imgRef.current. */
  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);
  /* A useEffect hook that is called when the completedCrop state is updated. It is used to draw the
  image on the canvas. */
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
  function generateDownload(canvas, crop) {
    if (!crop || !canvas) {
      return;
    }
    canvas.toBlob(async (blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        const base64data = reader.result;
        setCropImage(base64data);
        setModal(!modal);
      };
      const fileReader = new FileReader();
      const file = await new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            fileReader.readAsDataURL(blob);
            fileReader.onloadend = () => {
              resolve(dataURLtoFile(fileReader.result, "blog_main_image"));
            };
          },
          mime,
          1,
        );
      });
      setImageFile(file);
      setImage(file);
    });
  }

  return (
    <>
      <div className="main-img-blog p-1">
        <h4>Main image:</h4>
        <div className="d-flex">
          {(cropImage || url) && (
            <div className="me-25">
              <img
                className="rounded me-50"
                src={cropImage || url}
                alt="Generic placeholder image"
                height="70"
                width="160"
              />
            </div>
          )}
          <div className="d-flex flex-column">
            <Label className="mb-0">
              JPG , .PNG , .JPEG files are allowed with a file size maximum of 10 MB
            </Label>

            {url && (
              <Label className="sy-tx-primary mb-0">
                <a href={url} target="_blank">
                  {" "}
                  {url}{" "}
                </a>
              </Label>
            )}
            <InputGroup className="">
              <Input
                type="file"
                name="file"
                id="createImageUpload1"
                onChange={onSelectFile}
                accept={accept}
              />
              <Button
                tag={Label}
                className="custom-btn7 mb-0 btn btn-secondary"
                size="sm"
                color="primary"
              >
                Browse
                <Input
                  type="file"
                  id="createImageUpload"
                  onChange={onSelectFile}
                  hidden
                  accept={accept}
                />
              </Button>
            </InputGroup>
          </div>
        </div>
      </div>
      <Media className="mr-25">
        <div className="upload-box">
          <form>
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
                    // circularCrop={true}
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
          </form>
        </div>
      </Media>
    </>
  );
}
export default MainImgUpload;
