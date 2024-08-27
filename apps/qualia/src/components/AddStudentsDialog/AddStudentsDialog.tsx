'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shadcn/components/ui/dialog';
import { ReactMultiEmail } from 'react-multi-email';

import { addProfilesToClass } from '@/actions/addProfilesToClass';
import { Badge } from '@/shadcn/components/ui/badge';
import { Tables } from '@/types/supabase';
import dictionary from '@qualia/dictionary';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import 'react-multi-email/dist/style.css';
import { toast } from 'sonner';
import { Button } from '../Forms/Button/Button';

interface IAddUserDialog {
  classId: Tables<'classes'>['id'];
}

export const AddStudentsDialog = ({ classId }: IAddUserDialog) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const [state, formAction] = useFormState(
    addProfilesToClass.bind(null, emails, classId),
    [],
  );

  useEffect(() => {
    console.log(state);

    if (state instanceof Error) {
      toast.error(state.message);
      setOpen(false);
    } else {
      state.forEach((state) => {
        toast[state.status](state.message);
      });
      setOpen(false);
    }
  }, [state]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          {dictionary.add_students}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dictionary.add_students}</DialogTitle>
          <DialogDescription>
            {dictionary.class_add_students_descriptions}
          </DialogDescription>
        </DialogHeader>

        <ReactMultiEmail
          placeholder="Add student emails"
          emails={emails}
          onChange={(emails: string[]) => {
            setEmails(emails);
          }}
          getLabel={(email, index, removeEmail) => {
            return (
              <Badge variant="secondary" data-tag key={index}>
                <div data-tag-item>{email}</div>

                <span
                  data-tag-handle
                  className="ml-2"
                  onClick={() => removeEmail(index)}
                >
                  <X size={16} />
                </span>
              </Badge>
            );
          }}
        />

        <DialogFooter>
          <form action={formAction}>
            <input type="hidden" name="classId" value={classId} />
            <Button
              type="submit"
              disabled={emails.length === 0}
              pendingText={dictionary.class_add_students_saving_changes}
            >
              {dictionary.class_add_students_save_changes}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
