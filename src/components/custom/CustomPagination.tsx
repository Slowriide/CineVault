import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useSearchParams } from "react-router";

interface Props {
  totalPages: number;
}

export const CustomPagination = ({ totalPages }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryPage = searchParams.get("page") ?? "1";
  const page = isNaN(+queryPage) ? 1 : +queryPage;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    searchParams.set("page", page.toString());

    setSearchParams(searchParams);
  };

  const maxVisible = 10;
  const startPage = Math.max(1, page - Math.floor(maxVisible / 2));
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </Button>

      {pages.map((_, index) => (
        <Button
          key={index}
          variant={page === index + 1 ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(index + 1)}
        >
          {index + 1}
        </Button>
      ))}

      {/* <Button variant="outline" size="sm">
        2
      </Button> */}

      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
      >
        Siguiente
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
