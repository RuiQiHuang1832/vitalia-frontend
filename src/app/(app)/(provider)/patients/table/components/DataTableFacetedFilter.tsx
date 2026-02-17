import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Command, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Stack } from '@/components/ui/stack'
import { Column } from '@tanstack/react-table'
import { FaCircle } from "react-icons/fa";
import { LuCirclePlus } from 'react-icons/lu'

export function DataTableFacetedFilter<TData>({
  column,
  title,
  options,
}: {
  column: Column<TData, unknown>
  title: string
  options: { label: string; value: string; color: string }[]
}) {
  const selectedValues = new Set(column.getFilterValue() as string[])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className=" border-dashed">
          <LuCirclePlus className="size-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2" />
              <Badge className="rounded-md" variant="outline">
                {selectedValues.size} Selected
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-0" align="start">
        <Command>
          <CommandInput placeholder={`Filter ${title}`} />
          <CommandList>
            {options.map((option) => {
              const isSelected = selectedValues.has(option.value)

              return (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    if (isSelected) {
                      selectedValues.delete(option.value)
                    } else {
                      selectedValues.add(option.value)
                    }

                    column.setFilterValue(
                      selectedValues.size ? Array.from(selectedValues) : undefined
                    )
                  }}
                >
                  {
                    <Checkbox
                      checked={isSelected}
                      className="data-[state=checked]:[&>span>svg]:text-white"
                    />
                  }
                  <Stack className="w-full">
                    <Badge className={option?.color}>{option?.label}</Badge>
                  </Stack>
                </CommandItem>
              )
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
