"use client";

import { startTransition, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addComment } from "@/lib/actions";

const CommentForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    startTransition(async () => {
      try {
        await addComment(form);
        setMessage("✅ Merci pour votre commentaire !");
        setForm({ name: "", email: "", phone: "", comment: "" });
      } catch (err: any) {
        setMessage(`❌ ${err.message}`);
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 gap-4 mb-4">
          <Input
            type="text"
            name="name"
            placeholder="Nom"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            type="tel"
            name="phone"
            placeholder="Téléphone"
            value={form.phone}
            onChange={handleChange}
          />
          <textarea
            name="comment"
            className="w-full p-3 border rounded-md min-h-[150px]"
            placeholder="Commentaire ou message"
            value={form.comment}
            onChange={handleChange}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          {loading ? "Envoi..." : "Envoyer"}
        </Button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default CommentForm;
