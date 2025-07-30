'use client'

import { Button } from '@/components/ui/button'

interface PaginationProps {
  pageNumber: number
  totalPages: number
  setPageNumber: (page: number) => void
}

export default function ProductPagination({ pageNumber, totalPages, setPageNumber }: PaginationProps) {
  return (
    <div className="flex justify-center gap-2 mt-8">
      <Button
        onClick={() => setPageNumber(Math.max(pageNumber - 1, 1))}
        disabled={pageNumber === 1}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        Trang trước
      </Button>
      <span className="text-gray-600">
        Trang {pageNumber} / {totalPages}
      </span>
      <Button
        onClick={() => setPageNumber(Math.min(pageNumber + 1, totalPages))}
        disabled={pageNumber === totalPages}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        Trang sau
      </Button>
    </div>
  )
}