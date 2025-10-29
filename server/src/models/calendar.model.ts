import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICalendarEvent extends Document {
  title: string;
  date: Date;
  description?: string;
  userId: Types.ObjectId; // Reference user
}

const CalendarEventSchema = new Schema<ICalendarEvent>({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const CalendarEvent = mongoose.model<ICalendarEvent>('CalendarEvent', CalendarEventSchema);

export default CalendarEvent;
