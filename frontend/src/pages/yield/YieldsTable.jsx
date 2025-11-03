import { useState, useMemo } from "react";
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
import { DeleteDialog } from "@/components/DeleteDialog";
import { formatDateTime } from "@/utils/formatDateTime";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  cropTypes,
  seasons,
  units,
  buyerTypes,
} from "@/constants/yieldConstants";
import { capitalize } from "../../utils/capatalize";

export default function YieldsTable({ yields }) {
  const { removeYield } = useYields();

  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // ✅ Filters
  const [seasonFilter, setSeasonFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [unitFilter, setUnitFilter] = useState("all");

  // ✅ Dropdown open state (only one at a time)

  // ✅ Filtering logic
  const filteredYields = useMemo(() => {
    return (yields || []).filter((y) => {
      const matchSeason = seasonFilter === "all" || y.season === seasonFilter;
      const matchStatus = statusFilter === "all" || y.status === statusFilter;
      const matchUnit = unitFilter === "all" || y.unit === unitFilter;
      return matchSeason && matchStatus && matchUnit;
    });
  }, [yields, seasonFilter, statusFilter, unitFilter]);

  // ✅ Pagination calculations
  const totalPages = Math.ceil(filteredYields.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = filteredYields.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  // ✅ Delete handler
  const confirmDelete = async (id) => {
    await removeYield(id);
  };

  const formatRupees = (num) =>
    num ? `₹${Number(num).toLocaleString("en-IN")}` : "₹0";

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ✅ Total income for header
  const totalIncome = filteredYields.reduce(
    (sum, y) => sum + (y.sellingPrice?.totalPrice || 0),
    0
  );

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <TypographyH4>
          Yields Total Income:{" "}
          <span className="text-green-600">{formatRupees(totalIncome)}</span>
        </TypographyH4>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <Select value={seasonFilter} onValueChange={setSeasonFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by Season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Seasons</SelectItem>
              {seasons.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="growing">Growing</SelectItem>
              <SelectItem value="harvested">Harvested</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>

          <Select value={unitFilter} onValueChange={setUnitFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Units</SelectItem>
              {units.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Date</TableHead>
              <TableHead>Crop</TableHead>
              <TableHead>Season</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price/Unit</TableHead>
              <TableHead>Total Income</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentRecords.length > 0 ? (
              currentRecords.map((y) => (
                <TableRow key={y._id} className="hover:bg-gray-50">
                  <TableCell className="uppercase text-[13px]">
                    {formatDateTime(y.updatedAt || y.createdAt)}
                  </TableCell>

                  <TableCell className="capitalize font-medium">
                    {y.cropName || "—"}
                    <TypographySmall className="text-gray-500 block">
                      {y.variety || "—"}
                    </TypographySmall>
                  </TableCell>

                  <TableCell className="capitalize">
                    {y.season || "—"}
                  </TableCell>

                  <TableCell>
                    {y.quantity} {y.unit || "kg"}
                  </TableCell>

                  <TableCell>
                    {formatRupees(y.sellingPrice?.pricePerUnit)} -{" "}
                    {capitalize(y?.unit)}
                  </TableCell>

                  <TableCell className="font-semibold text-green-600">
                    {formatRupees(y.sellingPrice?.totalPrice)}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        y.status === "sold"
                          ? "bg-green-100 text-green-700"
                          : y.status === "harvested"
                          ? "bg-yellow-100 text-yellow-700"
                          : y.status === "growing"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {y.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-gray-100"
                        >
                          <Icon name="Ellipsis" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <QuickYield
                            view
                            yieldData={y}
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start font-normal"
                              >
                                <Icon name="Eye" /> View
                              </Button>
                            }
                          />
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                          <QuickYield
                            yieldData={y}
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start font-normal"
                              >
                                <Icon name="Edit2" /> Edit
                              </Button>
                            }
                          />
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                          <DeleteDialog
                            title="Delete Yield Record?"
                            description="Are you sure you want to delete this yield record? This action cannot be undone."
                            triggerText="Delete"
                            icon="Trash2"
                            onDelete={() => confirmDelete(y._id)}
                          />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      {/* ✅ Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <TypographySmall className="text-gray-500">
            Showing {startIndex + 1}–
            {Math.min(startIndex + recordsPerPage, filteredYields.length)} of{" "}
            {filteredYields.length}
          </TypographySmall>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              <Icon name="ChevronLeft" /> Prev
            </Button>

            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                size="sm"
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next <Icon name="ChevronRight" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
