import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import type { CreateNoteDto } from "@/types/note";
import css from './NoteForm.module.css';

interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().min(3).max(50).required(),
  content: Yup.string().max(500),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required(),
});

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (newNote: CreateNoteDto) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  return (
    <Formik
      initialValues={{ title: "", content: "", tag: "Todo" }}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        createMutation.mutate(values);
        actions.setSubmitting(false);
      }}
    >
      <Form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" style={{ width: '100%', padding: '8px' }} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div>
          <label htmlFor="content">Content</label>
          <Field as="textarea" id="content" name="content" rows={4} style={{ width: '100%', padding: '8px' }} />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" style={{ width: '100%', padding: '8px' }}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel} style={{ padding: '8px 16px' }}>Cancel</button>
          <button type="submit" disabled={createMutation.isPending} style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none' }}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}