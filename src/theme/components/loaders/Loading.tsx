import { Comment } from "react-loader-spinner";

export const Loading = () => {
  return (
    <div className="w-full h-screen bg-emerald-50  flex items-center justify-center">
      <Comment
        visible={true}
        height="100"
        width="100"
        ariaLabel="comment-loading"
        wrapperStyle={{}}
        wrapperClass="comment-wrapper"
        color="#DBF9ED"
        backgroundColor="#6EE7B7"
      />
    </div>
  );
};
