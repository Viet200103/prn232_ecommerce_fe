'use client'

import {Input} from '@/components/ui/input'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {ProductCategory} from "@/lib/types/product.type";

interface SearchFilterProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  categories: ProductCategory[],
  sortBy: string
  setSortBy: (value: string) => void
}

export default function SearchFilter(
  {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    categories,
    sortBy,
    setSortBy,
  }: SearchFilterProps
) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <Input
        placeholder="Tìm kiếm theo tên hoặc SKU..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
      />
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500">
          <SelectValue placeholder="Chọn danh mục"/>
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-300 text-gray-900 max-h-96">
          <SelectItem value="all" className="hover:bg-gray-100">Tất cả danh mục</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id} className="hover:bg-gray-100">
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500">
          <SelectValue placeholder="Sắp xếp theo"/>
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-300 text-gray-900">
          <SelectItem value="newest" className="hover:bg-gray-100">Mới nhất</SelectItem>
          <SelectItem value="oldest" className="hover:bg-gray-100">Cũ nhất</SelectItem>
          <SelectItem value="price_asc" className="hover:bg-gray-100">Giá thấp đến cao</SelectItem>
          <SelectItem value="price_desc" className="hover:bg-gray-100">Giá cao đến thấp</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}