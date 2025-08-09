'use client'

import { useEffect, useRef } from 'react'
import { SurveyCreatorComponent, SurveyCreatorModel } from 'survey-creator-react'
import { FormBuilderProps } from './types'

// SurveyJS Creator styles
import 'survey-creator-react/survey-creator-react.min.css'

export function FormDesigner({ onSave, initialDefinition, mode = 'create' }: FormBuilderProps) {
  const creatorRef = useRef<SurveyCreatorModel | null>(null)

  useEffect(() => {
    const creatorOptions = {
      showLogicTab: true,
      showTranslationTab: false,
      showEmbedSurveyTab: false,
      showThemeTab: true,
      showPreviewTab: true,
      isAutoSave: false,
    }

    const creator = new SurveyCreatorModel(creatorOptions)
    creatorRef.current = creator

    // Set initial form definition if provided
    if (initialDefinition) {
      creator.text = JSON.stringify(initialDefinition)
    } else {
      // Default empty form template
      creator.text = JSON.stringify({
        title: 'New Form',
        description: 'Please fill out this form',
        pages: [
          {
            name: 'page1',
            elements: [
              {
                type: 'text',
                name: 'question1',
                title: 'Your Name',
                isRequired: true
              }
            ]
          }
        ]
      })
    }

    // Configure the creator
    creator.toolbox.addToolboxItem({
      name: 'signature',
      title: 'Signature Pad',
      category: 'Custom',
      json: {
        type: 'text',
        inputType: 'text'
      }
    })

    // Save handler
    creator.saveSurveyFunc = (saveNo: number, callback: Function) => {
      try {
        const formDefinition = JSON.parse(creator.text)
        onSave(formDefinition)
        callback(saveNo, true)
      } catch (error) {
        console.error('Error saving form:', error)
        callback(saveNo, false)
      }
    }

    return () => {
      creator.dispose()
    }
  }, [onSave, initialDefinition])

  return (
    <div className="form-designer-container h-full w-full">
      <SurveyCreatorComponent creator={creatorRef.current!} />
    </div>
  )
}