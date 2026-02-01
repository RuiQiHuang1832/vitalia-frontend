import ClinicalPreviewSkeleton from '@/app/(app)/(provider)/dashboard/components/ClinicalPreview/ClinicalPreviewSkeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LuPillBottle } from 'react-icons/lu'

export default function ClinicalPreviewCard() {
  const isLoading = false
  if (isLoading) {
    return <ClinicalPreviewSkeleton />
  }
  return (
    <Card className="gap-0 h-full">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <CardTitle>Clinical Preview</CardTitle>
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
          Current Patient
        </span>
      </CardHeader>
      <CardContent className="space-y-4 mt-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Active Problems
          </div>{' '}
          <ul className="space-y-1">
            <li className="flex items-center text-sm ">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></span>
              Hypertension <span className="ml-1 text-gray-400 text-xs">(I10)</span>
            </li>
            <li className="flex items-center text-sm ">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></span>
              Type 2 Diabetes Mellitus
            </li>
            <li className="flex items-center text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></span>
              Hyperlipidemia
            </li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 ">
            Allergies
          </div>
          <ul className="space-y-1">
            <li className="flex items-center text-sm font-medium text-red-600">
              <span className="size-1.5 rounded-full bg-red-600 mr-2"></span>
              Penicillin <span className="ml-1 text-xs opacity-75">(Severe)</span>
            </li>
            <li className="flex items-center text-sm text-amber-600">
              <span className="size-1.5 rounded-full bg-amber-600 mr-2"></span>
              Shellfish <span className="ml-1 text-xs opacity-75 font-medium">(Mild)</span>
            </li>
            <li className="flex items-center text-sm text-amber-600">
              <span className="size-1.5 rounded-full bg-amber-600 mr-2"></span>
              Sulfa Drugs <span className="ml-1 text-xs opacity-75 font-medium">(Mild)</span>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Medication
          </div>
          <ul>
            <li className="flex items-center text-sm ">
              <LuPillBottle className="mr-2" />
              Lisinopril <span className="ml-1 text-gray-400 text-sm">(10 mg daily)</span>
            </li>
            <li className="flex items-center text-sm ">
              <LuPillBottle className="mr-2" />
              Metformin <span className="ml-1 text-gray-400 text-sm">(10 mg daily)</span>
            </li>
            <li className="flex items-center text-sm ">
              <LuPillBottle className="mr-2" />
              Metformin <span className="ml-1 text-gray-400 text-sm">(10 mg daily)</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
