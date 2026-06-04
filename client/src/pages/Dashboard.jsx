import React, { useEffect, useState } from 'react'
import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
  XIcon,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'
import api from '../configs/api'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import pdfToText from 'react-pdftotext'

const Dashboard = () => {

  const { user, token } = useSelector(state => state.auth)
  const navigate = useNavigate()

  const [allResumes, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get('/api/users/resumes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setAllResumes(data.resumes || [])

    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    loadAllResumes()
  }, [])

  // ✅ CREATE RESUME FIXED
  const createResume = async (event) => {
    event.preventDefault()

    try {
      const { data } = await api.post(
        '/api/resumes/create',
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setAllResumes(prev => [...prev, data.resume])
      setTitle('')
      setShowCreateResume(false)

      navigate(`/app/builder/${data.resume._id}`)

    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const uploadResume = async (event) => {
    event.preventDefault()

    setIsLoading(true)

    try {
      const resumeText = await pdfToText(resumeFile)

      const { data } = await api.post(
        '/api/ai/upload-resume',
        { title, resumeText },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setTitle('')
      setResumeFile(null)
      setShowUploadResume(false)

      navigate(`/app/builder/${data.resumeId}`)

    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }

    setIsLoading(false)
  }

  // ✅ DELETE FIXED
  const deleteResume = async (resumeId) => {
    try {
      if (!window.confirm("Are you sure?")) return

      await api.delete(`/api/resumes/delete/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setAllResumes(prev => prev.filter(r => r._id !== resumeId))
      toast.success('Resume deleted')

    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>

      <p className='text-2xl font-medium mb-6'>
        Welcome, {user?.name}
      </p>

      <div className='flex gap-4 flex-wrap mb-8'>

        <button onClick={() => setShowCreateResume(true)}>
          <PlusIcon />
          Create Resume
        </button>

        <button onClick={() => setShowUploadResume(true)}>
          <UploadIcon />
          Upload Existing
        </button>

      </div>

      <div className='grid gap-4'>
        {allResumes.map((resume) => (
          <div
            key={resume._id}
            onClick={() => navigate(`/app/builder/${resume._id}`)}
            className='border p-4 cursor-pointer relative'
          >
            <p>{resume.title}</p>

            <TrashIcon
              onClick={(e) => {
                e.stopPropagation()
                deleteResume(resume._id)
              }}
              className='absolute top-2 right-2 cursor-pointer'
            />
          </div>
        ))}
      </div>

      {showCreateResume && (
        <form onSubmit={createResume}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Title'
          />
          <button>Create</button>
          <XIcon onClick={() => setShowCreateResume(false)} />
        </form>
      )}

    </div>
  )
}

export default Dashboard