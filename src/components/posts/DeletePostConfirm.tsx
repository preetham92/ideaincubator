import { PostData } from "@/lib/types";
import LoadingButton from "@/components/lodingbutton";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useDeletePostMutation } from "./mutations";
import { Trash2, XCircle } from "lucide-react";

interface DeletePostDialogProps {
  post: PostData;
  open: boolean;
  onClose: () => void;
}

export default function DeletePostDialog({
  post,
  open,
  onClose,
}: DeletePostDialogProps) {
  const mutation = useDeletePostMutation();

  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg">
        <DialogHeader className="flex flex-col items-center text-center">
          <Trash2 className="h-10 w-10 text-[#E94560] dark:text-[#FF7E67]" />
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
            Delete this post forever?
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
            Once it's gone, it's gone. No takebacks. No regrets. 🚀
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-between w-full mt-4">
          <LoadingButton
            variant="destructive"
            onClick={() => mutation.mutate(post.id, { onSuccess: onClose })}
            loading={mutation.isPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-red-600 hover:bg-red-700 transition-all rounded-lg"
          >
            <Trash2 className="h-5 w-5" /> Yes, Delete
          </LoadingButton>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all rounded-lg"
          >
            <XCircle className="h-5 w-5" /> Nevermind
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
