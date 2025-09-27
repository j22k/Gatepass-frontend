import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { visitorTypeService } from '../services/visitorTypeService'
import { warehouseService } from '../services/warehouseService'
import { warehouseTimeSlotService } from '../services/warehouseTimeSlotService'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

const LandingPage = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, control, watch, formState: { errors }, setValue, reset } = useForm({
    defaultValues: {
      accompanying: []
    }
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'accompanying'
  })

  const [visitorTypes, setVisitorTypes] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const selectedWarehouse = watch('warehouseId')

  useEffect(() => {
    fetchVisitorTypes()
    fetchWarehouses()
  }, [])

  const fetchVisitorTypes = async () => {
    try {
      const data = await visitorTypeService.getPublicVisitorTypes()
      setVisitorTypes(data || [])
    } catch (error) {
      console.error('Error fetching visitor types:', error)
      setVisitorTypes([])
    }
  }

  const fetchWarehouses = async () => {
    try {
      const data = await warehouseService.getPublicWarehouses()
      setWarehouses(data || [])
    } catch (error) {
      console.error('Error fetching warehouses:', error)
      setWarehouses([])
    }
  }

  // Replace local filtering with public GET by ID (no auth required)
  useEffect(() => {
    let active = true
    const load = async () => {
      if (selectedWarehouse) {
        try {
          const slot = await warehouseTimeSlotService.getTimeSlotPublicById(selectedWarehouse)
          if (!active) return
          // Backend may return a single object or an array; normalize to array
          const slots = Array.isArray(slot) ? slot : (slot ? [slot] : [])
          setTimeSlots(slots)
        } catch (error) {
          console.error('Error fetching time slot:', error)
          if (active) setTimeSlots([])
        }
      } else {
        setTimeSlots([])
        setValue('warehouseTimeSlotId', '')
      }
    }
    load()
    return () => { active = false }
  }, [selectedWarehouse, setValue])

  const onSubmit = async (data) => {
    try {
      // Transform data to match API requirements
      const formData = {
        ...data,
        visitorTypeId: data.visitorTypeId,
        warehouseId: data.warehouseId,
        warehouseTimeSlotId: data.warehouseTimeSlotId,
        accompanying: data.accompanying || [],
        date: data.date,
      }
      
      await visitorTypeService.createVisitor(formData)
      alert('Visitor request submitted successfully!')
      reset() // Reset form after successful submission
    } catch (error) {
      console.error('Error submitting visitor request:', error)
      alert('Failed to submit request. Please try again.')
    }
  }

  const addAccompanying = () => {
    if (fields.length < 4) {
      append({ name: '', phone: '', email: '' })
    }
  }

  const removeAccompanying = (index) => {
    remove(index)
  }

  const today = new Date().toISOString().split('T')[0] // For date min

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">GatePass</h1>
            </div>
            <div className="flex items-center">
              <Button onClick={() => navigate('/login')} variant="outline">
                Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Form */}
      <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Visitor Request</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name, Email, Phone in a row on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Name"
              placeholder="Enter your name"
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
            />
            <Input
              label="Email"
              type="email"
              placeholder="Enter email"
              {...register('email', { required: 'Email is required' })}
              error={errors.email?.message}
            />
            <Input
              label="Phone Number"
              placeholder="Enter phone number"
              {...register('phone', { required: 'Phone is required' })}
              error={errors.phone?.message}
            />
          </div>

          {/* Visitor Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visitor Type</label>
              <select
                {...register('visitorTypeId', { required: 'Visitor Type is required' })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Visitor Type</option>
                {visitorTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              {errors.visitorTypeId && <p className="mt-1 text-sm text-red-600">{errors.visitorTypeId.message}</p>}
            </div>

            {/* Warehouse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
              <select
                {...register('warehouseId', { required: 'Warehouse is required' })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Warehouse</option>
                {warehouses.map((wh) => (
                  <option key={wh.id} value={wh.id}>{wh.name}</option>
                ))}
              </select>
              {errors.warehouseId && <p className="mt-1 text-sm text-red-600">{errors.warehouseId.message}</p>}
            </div>
          </div>

          {/* Time Slot and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
              <select
                {...register('warehouseTimeSlotId', { required: 'Time Slot is required' })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={!selectedWarehouse}
              >
                <option value="">Select Time Slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.name} ({slot.from?.substring(0, 5)} - {slot.to?.substring(0, 5)})
                  </option>
                ))}
              </select>
              {errors.warehouseTimeSlotId && (
                <p className="mt-1 text-sm text-red-600">{errors.warehouseTimeSlotId.message}</p>
              )}
            </div>

            <Input
              label="Date"
              type="date"
              min={today}
              {...register('date', { required: 'Date is required' })}
              error={errors.date?.message}
            />
          </div>

          {/* Description */}
          <Input
            label="Description"
            placeholder="Enter description"
            {...register('description', { required: 'Description is required' })}
            error={errors.description?.message}
          />

          {/* Accompanying Persons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Accompanying Persons (up to 4)</label>
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded">
                <Input
                  label="Name"
                  placeholder="Name"
                  {...register(`accompanying.${index}.name`, { required: 'Name is required' })}
                  error={errors.accompanying?.[index]?.name?.message}
                />
                <Input
                  label="Phone"
                  placeholder="Phone"
                  {...register(`accompanying.${index}.phone`, { required: 'Phone is required' })}
                  error={errors.accompanying?.[index]?.phone?.message}
                />
                <div className="flex items-end space-x-2">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="Email"
                    {...register(`accompanying.${index}.email`, { required: 'Email is required' })}
                    error={errors.accompanying?.[index]?.email?.message}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => removeAccompanying(index)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            {fields.length < 4 && (
              <Button type="button" variant="outline" onClick={addAccompanying}>
                Add Accompanying Person
              </Button>
            )}
          </div>

          <Button type="submit" className="w-full">
            Submit Request
          </Button>
        </form>
      </div>
    </div>
  )
}

export default LandingPage
