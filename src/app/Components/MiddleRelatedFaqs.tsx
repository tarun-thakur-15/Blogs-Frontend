"use client";
import React, { useState } from "react";
import RelatedFaqs from "./RelatedFaqs";
type FAQ = {
  id: string;
  question: string;
  answer: string;
  likes_count: number;
  liked: boolean;
};

type MiddleRelatedFaqsProps = {
  answerBoxes: FAQ[];
};

const MiddleRelatedFaqs = () => {

  return (
    <RelatedFaqs/>
  );
};

export default MiddleRelatedFaqs;
