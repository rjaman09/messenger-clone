"use client";

import axios from "axios";
import { useCallback, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { Transition, Dialog } from "@headlessui/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useConversation from "@/app/hooks/useConversation";

import Modal from "@/app/components/Modal";
import Button from "@/app/components/Button";

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = useCallback(() => {
    setIsLoading(true);

    axios.delete(`/api/conversations/${conversationId}`)
    .then(() => {
      onClose();
      router.push("/conversations");
      router.refresh();
    })
    .catch(() => toast.error("Something went wrong. Try again later"))
    .finally(() => setIsLoading(false));
  }, [conversationId, router, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <FiAlertTriangle className="h-5 w-5 text-red-600" />
        </div>

        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <Dialog.Title as="h3" className="text-base font-semibold leading-8 text-gray-900">Delete conversation</Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500 tracking-wide">Are you sure you want to delete this conversation? Once you deleted this conversation you cannot be able to undo this action.</p>
          </div>
        </div>
      </div>

      <div className="mt-5 sm:mt-4 flex md:flex-row-reverse justify-between">
        <Button disabled={isLoading} secondary onClick={onClose}>Cancel</Button>
        <Button disabled={isLoading} danger onClick={onDelete}>Delete</Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;