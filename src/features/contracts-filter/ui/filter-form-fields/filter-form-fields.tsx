'use client'

import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { MAX_LENGTH_LARGE } from '@/shared/config/constants'
import { formatNumber } from '@/shared/lib/utils'
import { Checkbox } from '@/shared/ui/checkbox'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

import { DEFAULT_FILTERS } from '../../config'
import { clampPrice } from '../../lib'
import type { FilterFormValues } from '../../model'
import { KladrAutocomplete } from '../kladr-autocomplete'
import { LawsMultiSelect } from '../laws-multi-select'

type FilterFormFieldsProps = {
  control: Control<FilterFormValues>
}

export function FilterFormFields({ control }: FilterFormFieldsProps) {
  return (
    <>
      <Controller
        control={control}
        name="keywords"
        render={({ field }) => (
          <Input {...field} placeholder="Ключевые слова или номер" maxLength={MAX_LENGTH_LARGE} />
        )}
      />

      <Controller
        control={control}
        name="ignoreKeywords"
        render={({ field }) => (
          <Input {...field} placeholder="Исключить слова" maxLength={MAX_LENGTH_LARGE} />
        )}
      />

      <div className="grid grid-cols-2 gap-2">
        <Controller
          control={control}
          name="priceFrom"
          render={({ field }) => (
            <Input
              placeholder="От"
              suffix="₽"
              value={field.value || field.value === 0 ? formatNumber(field.value) : ''}
              onChange={(e) => field.onChange(clampPrice(e.target.value))}
            />
          )}
        />

        <Controller
          control={control}
          name="priceTo"
          render={({ field }) => (
            <Input
              placeholder="До"
              suffix="₽"
              value={field.value || field.value === 0 ? formatNumber(field.value) : ''}
              onChange={(e) => field.onChange(clampPrice(e.target.value))}
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="kladrItems"
        render={({ field }) => <KladrAutocomplete value={field.value} onChange={field.onChange} />}
      />

      <Controller
        control={control}
        name="laws"
        render={({ field }) => (
          <LawsMultiSelect
            value={field.value}
            onChange={(val) => {
              const nextVal = val.length > 0 ? val : DEFAULT_FILTERS.laws
              field.onChange(nextVal)
            }}
          />
        )}
      />

      <Controller
        control={control}
        name="searchInDocuments"
        render={({ field }) => (
          <div className="flex items-center gap-2 py-1">
            <Checkbox
              className="border-brand-accent data-checked:border-brand-accent data-checked:bg-brand-accent"
              id="searchInDocuments"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="searchInDocuments" className="text-sm font-normal">
              Искать в документах
            </Label>
          </div>
        )}
      />

      <Controller
        control={control}
        name="searchInLots"
        render={({ field }) => (
          <div className="flex items-center gap-2 py-1">
            <Checkbox
              className="border-brand-accent data-checked:border-brand-accent data-checked:bg-brand-accent"
              id="searchInLots"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="searchInLots" className="text-sm font-normal">
              Искать в лотах
            </Label>
          </div>
        )}
      />
    </>
  )
}
