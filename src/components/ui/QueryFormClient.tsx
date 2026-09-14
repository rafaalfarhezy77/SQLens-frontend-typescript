"use client";

import React, { useState } from 'react';
import { z } from 'zod';
import { useUIStore } from '@/store/useUIStore';

const SqlQuerySchema = z.object({
  queryText: z
    .string()
    .min(1, "Perintah SQL tidak boleh kosong!")
    .min(5, "Query SQL terlalu pendek (minimal 5 karakter)")
    .refine(
      (val: string) => /^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|SHOW|DESCRIBE)/i.test(val),
      {
        message: "Format tidak valid! Wajib diawali kata kunci SQL (SELECT, INSERT, UPDATE, DELETE, dll).",
      }
    ),
});

interface QueryFormProps {
  onExecute?: (query: string) => void;
  isLoading?: boolean;
}

export default function QueryFormClient({ onExecute, isLoading = false }: QueryFormProps) {
  const [queryText, setQueryText] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const selectedTable = useUIStore((state) => state.selectedTable);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = SqlQuerySchema.safeParse({ queryText });

    if (!result.success) {
      setErrorMessage(result.error.errors[0].message);
      return;
    }

    setErrorMessage(null);
    if (onExecute) {
      onExecute(queryText);
    }
  };

  const handleInsertSample = () => {
    const sample = `SELECT * FROM ${selectedTable || 'users'} LIMIT 5;`;
    setQueryText(sample);
    setErrorMessage(null);
  };

  return (