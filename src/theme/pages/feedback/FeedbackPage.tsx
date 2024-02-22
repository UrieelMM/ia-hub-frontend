"use client";
import { useState } from "react";
import {
  Button,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
} from "@nextui-org/react";

import FeedbackRating from "./feedback-raiting";


const [message, setMessages] = useState("");
const [raiting, setRaiting] = useState("");

const handleFeedback = (e: any) => {
  e.preventDefault()
  console.log(message, raiting);
}

const FeedbackPage = () => {
  return (
    <div>
      <Popover defaultOpen shouldBlockScroll={false}>
        <PopoverTrigger>
          <Button variant="bordered">Feedback</Button>
        </PopoverTrigger>
        <PopoverContent className="w-[340px] p-3">
          <form
            className="flex w-full flex-col gap-2"
            onSubmit={(e) => handleFeedback(e)}
          >
            <Textarea
              onChange={(e) => setMessages(e.target.value)}
              aria-label="Feedback"
              name="feedback"
              placeholder="Ideas or suggestions to improve our product"
              variant="faded"
            />

            <Divider className="my-2" />

            <div className="flex w-full items-center justify-between">
              <FeedbackRating name="rating" onChange={(e) => setRaiting(e.target.value)} />
              <Button color="primary" size="sm" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FeedbackPage;
