import mongoose from 'mongoose';

const jobSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    companyName: {
      type: String,
      required: [true, 'Please add a company name'],
    },
    jobRole: {
      type: String,
      required: [true, 'Please add a job role'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    applicationDate: {
      type: Date,
      required: [true, 'Please add an application date'],
      default: Date.now,
    },
    status: {
      type: String,
      required: [true, 'Please add a status'],
      enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
    },
    priority: {
      type: String,
      required: [true, 'Please add a priority'],
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    platform: {
      type: String,
      default: 'Company Site',
    },
    skills: {
      type: [String],
      default: [],
    },
    interviewSchedule: {
      date: Date,
      time: String,
      mode: String, // Online, In-Person
      round: String, // Technical, HR
    },
    timeline: [
      {
        status: String,
        date: Date,
      }
    ],
    documents: [
      {
        name: String,
        url: String,
      }
    ],
    jobLink: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
