"use client";

import React, { useEffect, useState } from "react";
import CommentCard from "./comment-card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Carousel from "./carousel";
import { useMediaQuery } from "@/hooks/use-media-query";

interface Comment {
  id: number;
  name: string;
  comment: string;
  show_on_home: boolean;
  created_at: string;
}

const CommentsSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  const [cardsPerSlide, setCardsPerSlide] = useState(3);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  useEffect(() => {
    if (isMobile) setCardsPerSlide(1);
    else if (isTablet) setCardsPerSlide(2);
    else setCardsPerSlide(3);
  }, [isMobile, isTablet]);

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("id, name, comment, show_on_home, created_at")
        .eq("show_on_home", true)
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching comments:", error.message);
      else setComments(data || []);

      setLoading(false);
    };

    fetchComments();
  }, [supabase]);

  if (loading) {
    return (
      <section className="py-12 text-center">
        <p>Chargement des témoignages...</p>
      </section>
    );
  }

  if (comments.length === 0) {
    return (
      <section className="py-12 text-center">
        <p>Aucun témoignage pour le moment.</p>
      </section>
    );
  }

  // Group comments into slides
  const groupedComments: Comment[][] = [];
  for (let i = 0; i < comments.length; i += cardsPerSlide) {
    groupedComments.push(comments.slice(i, i + cardsPerSlide));
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Témoignages</h2>

        <Carousel
          autoSlideInterval={4000}
          className="w-full"
          showArrows={false}
        >
          {groupedComments.map((group, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4"
            >
              {group.map((c) => (
                <CommentCard key={c.id} name={c.name} comment={c.comment} />
              ))}
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default CommentsSection;
