'use client'

import { FormValidationRule, FormTemplate } from './types'

export class FormValidationEngine {
  private rules: FormValidationRule[] = []

  constructor(rules: FormValidationRule[] = []) {
    this.rules = rules
  }

  addRule(rule: FormValidationRule) {
    this.rules.push(rule)
  }

  removeRule(field: string, type?: string) {
    this.rules = this.rules.filter(rule => 
      rule.field !== field || (type && rule.type !== type)
    )
  }

  validateField(field: string, value: any, formData: Record<string, any> = {}): string[] {
    const errors: string[] = []
    const fieldRules = this.rules.filter(rule => rule.field === field)

    for (const rule of fieldRules) {
      // Check if rule condition is met (if specified)
      if (rule.condition && !this.evaluateCondition(rule.condition, formData)) {
        continue
      }

      const error = this.validateRule(rule, value, formData)
      if (error) {
        errors.push(error)
      }
    }

    return errors
  }

  validateForm(formData: Record<string, any>): Record<string, string[]> {
    const errors: Record<string, string[]> = {}

    // Get all unique fields from rules
    const fields = [...new Set(this.rules.map(rule => rule.field))]

    for (const field of fields) {
      const fieldErrors = this.validateField(field, formData[field], formData)
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors
      }
    }

    return errors
  }

  private validateRule(rule: FormValidationRule, value: any, formData: Record<string, any>): string | null {
    switch (rule.type) {
      case 'required':
        return this.validateRequired(value) ? null : rule.message

      case 'email':
        return this.validateEmail(value) ? null : rule.message

      case 'number':
        return this.validateNumber(value) ? null : rule.message

      case 'minLength':
        return this.validateMinLength(value, rule.value) ? null : rule.message

      case 'maxLength':
        return this.validateMaxLength(value, rule.value) ? null : rule.message

      case 'pattern':
        return this.validatePattern(value, rule.value) ? null : rule.message

      case 'custom':
        return this.validateCustom(value, rule.value, formData) ? null : rule.message

      default:
        return null
    }
  }

  private validateRequired(value: any): boolean {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    return Boolean(value)
  }

  private validateEmail(value: any): boolean {
    if (!value) return true // Let required rule handle empty values
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(String(value))
  }

  private validateNumber(value: any): boolean {
    if (!value) return true // Let required rule handle empty values
    return !isNaN(Number(value))
  }

  private validateMinLength(value: any, minLength: number): boolean {
    if (!value) return true // Let required rule handle empty values
    return String(value).length >= minLength
  }

  private validateMaxLength(value: any, maxLength: number): boolean {
    if (!value) return true
    return String(value).length <= maxLength
  }

  private validatePattern(value: any, pattern: string): boolean {
    if (!value) return true // Let required rule handle empty values
    const regex = new RegExp(pattern)
    return regex.test(String(value))
  }

  private validateCustom(value: any, validator: Function, formData: Record<string, any>): boolean {
    try {
      return validator(value, formData)
    } catch (error) {
      console.error('Custom validation error:', error)
      return false
    }
  }

  private evaluateCondition(condition: string, formData: Record<string, any>): boolean {
    try {
      // Simple condition evaluation - can be enhanced for more complex logic
      // For now, supports basic comparisons like "field1 === 'value'"
      const func = new Function('data', `with(data) { return ${condition}; }`)
      return func(formData)
    } catch (error) {
      console.error('Condition evaluation error:', error)
      return true // Default to true if condition can't be evaluated
    }
  }
}

// Predefined validation rule sets for common form types
export const getValidationRulesForTemplate = (template: FormTemplate): FormValidationRule[] => {
  const rules: FormValidationRule[] = []

  switch (template.id) {
    case 'purchase-request':
      rules.push(
        {
          field: 'requestTitle',
          type: 'required',
          message: 'Request title is required'
        },
        {
          field: 'requestTitle',
          type: 'minLength',
          value: 5,
          message: 'Request title must be at least 5 characters long'
        },
        {
          field: 'amount',
          type: 'required',
          message: 'Amount is required'
        },
        {
          field: 'amount',
          type: 'number',
          message: 'Amount must be a valid number'
        },
        {
          field: 'amount',
          type: 'custom',
          value: (value: any) => parseFloat(value) > 0,
          message: 'Amount must be greater than 0'
        },
        {
          field: 'vendor',
          type: 'required',
          message: 'Vendor name is required'
        },
        {
          field: 'justification',
          type: 'required',
          message: 'Business justification is required'
        },
        {
          field: 'justification',
          type: 'minLength',
          value: 20,
          message: 'Please provide a detailed justification (at least 20 characters)'
        }
      )
      break

    case 'vendor-evaluation':
      rules.push(
        {
          field: 'vendorName',
          type: 'required',
          message: 'Vendor name is required'
        },
        {
          field: 'contactPerson',
          type: 'required',
          message: 'Contact person is required'
        },
        {
          field: 'email',
          type: 'required',
          message: 'Contact email is required'
        },
        {
          field: 'email',
          type: 'email',
          message: 'Please enter a valid email address'
        },
        {
          field: 'qualityScore',
          type: 'required',
          message: 'Quality score is required'
        },
        {
          field: 'pricingScore',
          type: 'required',
          message: 'Pricing score is required'
        },
        {
          field: 'deliveryScore',
          type: 'required',
          message: 'Delivery score is required'
        }
      )
      break

    case 'contract-review':
      rules.push(
        {
          field: 'contractTitle',
          type: 'required',
          message: 'Contract title is required'
        },
        {
          field: 'counterparty',
          type: 'required',
          message: 'Counterparty is required'
        },
        {
          field: 'finalRecommendation',
          type: 'required',
          message: 'Final recommendation is required'
        },
        {
          field: 'legalConcerns',
          type: 'required',
          condition: 'termsAcceptable === false',
          message: 'Please explain legal concerns when terms are not acceptable'
        }
      )
      break

    case 'expense-report':
      rules.push(
        {
          field: 'employeeName',
          type: 'required',
          message: 'Employee name is required'
        },
        {
          field: 'employeeId',
          type: 'required',
          message: 'Employee ID is required'
        },
        {
          field: 'department',
          type: 'required',
          message: 'Department is required'
        },
        {
          field: 'manager',
          type: 'required',
          message: 'Direct manager is required'
        },
        {
          field: 'expenses',
          type: 'custom',
          value: (value: any[]) => value && value.length > 0,
          message: 'At least one expense item is required'
        }
      )
      break

    default:
      // Generic validation rules
      break
  }

  return rules
}