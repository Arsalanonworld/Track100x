
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { useState } from 'react';
import { CreateAlertDialog } from '../create-alert-dialog';


export default function AlertCreatorCard() {
  const [isAlertEditorOpen, setIsAlertEditorOpen] = useState(false);

  return (
    <Dialog open={isAlertEditorOpen} onOpenChange={setIsAlertEditorOpen}>
      <Card>
        <CardHeader>
          <CardTitle>Create New Alert</CardTitle>
          <CardDescription>
            Build a custom alert to track on-chain activity from scratch.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DialogTrigger asChild>
            <Button className="w-full">Create a Custom Alert</Button>
          </DialogTrigger>
        </CardContent>
      </Card>
      {isAlertEditorOpen && <CreateAlertDialog onOpenChange={setIsAlertEditorOpen} />}
    </Dialog>
  );
}
