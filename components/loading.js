import Loader from "react-loader-spinner";

export default function Loading() {
  return (
    <>
      <div>
        <Loader type="ThreeDots" color="#00BFFF" height={100} width={100} />
      </div>
      <style jsx>{`
        div {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100vh;
        }
      `}</style>
    </>
  );
}
