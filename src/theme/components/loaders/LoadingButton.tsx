import { Bars } from "react-loader-spinner";

export const LoadingButton = () => {
    return (
          <Bars
            visible={true}
            height="40"
            width="205"
            ariaLabel="comment-loading"
            wrapperStyle={{}}
            wrapperClass="comment-wrapper"
            color="#10b981"
          />
      );
}