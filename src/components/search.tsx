import { Input } from "@/components/ui/input"

export const Search = () => {
  return (
    <div>
      <Input
        type="search"
        placeholder="Search books..."
        className="md:w-[300px] lg:w-[600px]"
      />
    </div>
  )
}
