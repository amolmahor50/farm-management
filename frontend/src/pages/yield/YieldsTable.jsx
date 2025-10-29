import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/custom/Icon";
import { TypographyH4, TypographySmall } from "@/custom/Typography";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QuickYield } from "./QuickYield";
import { useYields } from "@/contexts/YieldContext";
import { toastError } from "@/utils/toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function YieldsTable({ yields }) {
  const { removeYield } = useYields();
  const [deleteId, setDeleteId] = useState(null);
  const [open, setOpen] = useState(false);

  //  Confirmed delete handler
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await removeYield(deleteId);
    } catch (err) {
      toastError("Please try again.");
    } finally {
      setOpen(false);
      setDeleteId(null);
    }
  };

  //  Format date + time
  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Card>
      <TypographyH4>Recent Yields</TypographyH4>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Crop</TableHead>
              <TableHead>Season</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price/Unit</TableHead>
              <TableHead>Total Income</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {yields && yields.length > 0 ? (
              yields.map((y) => (
                <TableRow key={y._id}>
                  <TableCell className="uppercase">
                    {formatDateTime(y.updatedAt || y.createdAt)}
                  </TableCell>

                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 capitalize">
                      {y.cropName}
                    </span>
                  </TableCell>

                  <TableCell className="capitalize">{y.season}</TableCell>

                  <TableCell>
                    {y.buyer?.name ? (
                      <div className="grid gap-1 capitalize">
                        <span>Name: {y?.buyer?.name}</span>
                        <span>Phone: {y?.buyer?.phone}</span>
                        <span>Type: {y?.buyer?.type}</span>
                      </div>
                    ) : (
                      <TypographySmall className="text-gray-400">
                        —
                      </TypographySmall>
                    )}
                  </TableCell>

                  <TableCell>
                    {y.quantity} {y.unit || "kg"}
                  </TableCell>

                  <TableCell>
                    ₹{y.sellingPrice?.pricePerUnit?.toLocaleString() || 0}
                  </TableCell>

                  <TableCell className="font-semibold text-green-600">
                    ₹{y.sellingPrice?.totalPrice?.toLocaleString() || 0}
                  </TableCell>

                  <TableCell className="flex gap-2">
                    <QuickYield
                      yieldData={y}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit"
                          className="hover:bg-green-50"
                        >
                          <Icon name="Edit2" />
                        </Button>
                      }
                    />

                    {/*  Delete with ShadCN AlertDialog */}
                    <AlertDialog
                      open={open && deleteId === y._id}
                      onOpenChange={setOpen}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setDeleteId(y._id);
                            setOpen(true);
                          }}
                        >
                          <Icon name="Trash2" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete Yield Record
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this yield record?
                            This action
                            <strong> cannot be undone.</strong>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => {
                              setOpen(false);
                              setDeleteId(null);
                            }}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={confirmDelete}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-gray-500"
                >
                  No yields found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
