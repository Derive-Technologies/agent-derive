'use client'

import { useEffect, useRef, useState } from 'react'
import { Model, SurveyModel } from 'survey-react-ui'
import { Survey } from 'survey-react-ui'
import { FormRendererProps } from './types'

// SurveyJS styles
import 'survey-react-ui/survey.min.css'

export function FormRenderer({ 
  formDefinition, 
  onSubmit, 
  initialData, 
  readOnly = false,
  showNavigationButtons = true 
}: FormRendererProps) {
  const surveyRef = useRef<SurveyModel | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!formDefinition) return

    try {
      setIsLoading(true)
      
      const survey = new Model(formDefinition)
      surveyRef.current = survey

      // Configure survey behavior
      survey.showNavigationButtons = showNavigationButtons
      survey.showCompletedPage = !readOnly
      survey.mode = readOnly ? 'display' : 'edit'

      // Set initial data if provided
      if (initialData) {
        survey.data = initialData
      }

      // Handle form completion
      survey.onComplete.add((sender) => {
        if (!readOnly && onSubmit) {
          onSubmit(sender.data)
        }
      })

      // Handle value changes for real-time updates
      survey.onValueChanged.add((sender, options) => {
        if (readOnly) return
        
        // You can add real-time validation or data processing here
        console.log('Form data changed:', sender.data)
      })

      setIsLoading(false)
    } catch (error) {
      console.error('Error initializing form renderer:', error)
      setIsLoading(false)
    }

    return () => {
      if (surveyRef.current) {
        surveyRef.current.dispose()
      }
    }
  }, [formDefinition, initialData, readOnly, onSubmit, showNavigationButtons])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading form...</span>
      </div>
    )
  }

  if (!surveyRef.current) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-2">Failed to load form</div>
          <p className="text-sm text-gray-400">Please check the form definition</p>
        </div>
      </div>
    )
  }

  return (
    <div className="form-renderer-container w-full">
      <Survey model={surveyRef.current} />
    </div>
  )
}

// Utility component for read-only form display
export function FormDisplay({ formDefinition, data }: { formDefinition: any; data: any }) {
  return (
    <FormRenderer
      formDefinition={formDefinition}
      onSubmit={() => {}}
      initialData={data}
      readOnly={true}
      showNavigationButtons={false}
    />
  )
}