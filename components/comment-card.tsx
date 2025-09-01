// components/CommentCard.tsx
import React from "react";

interface CommentCardProps {
  name: string;
  comment: string;
}

const CommentCard: React.FC<CommentCardProps> = ({ name, comment }) => {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-600 mb-4">"{comment}"</p>
      <div className="flex items-center">
        <div className="w-10 h-10 flex items-center justify-center bg-green-500 text-white font-bold rounded-full mr-3">
          {initial}
        </div>
        <span className="font-medium">{name}</span>
      </div>
    </div>
  );
};

export default CommentCard;
