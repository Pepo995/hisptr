import { ShimmerSimpleGallery } from "react-shimmer-effects";

function ShimmerCard() {
  return (
    <>
      <div className="video-card">
        <ShimmerSimpleGallery card imageHeight={300} caption />
      </div>
    </>
  );
}
export default ShimmerCard;
