import { PostForm } from "../PostForm";
import { createPost } from "../actions";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">New Post</h1>
      <PostForm action={createPost} submitLabel="Create" />
    </div>
  );
}
