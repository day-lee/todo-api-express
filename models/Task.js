import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
    /*
    fields definition 
    id will be auto created, no need to specify here

    required, maxLength are for validation
    */
    {
        title: {
            type: String,
            required: true,
            maxLength: 30,
            validate: {
                validator: function (title) {
                    return title.split(' ').length > 1;
                },
                message: "must contain at least 2 words."
            }
        },
        description: {
            type: String,
        },
        isComplete: {
            type: Boolean,
            required: true,
            default: false,
        },
    }, {
        timestamps: true,
        // optional: mongoose will automatically make createdAt, updatedAt 
    },
)

const Task = mongoose.model('Task', TaskSchema); // collection name: tasks

export default Task; 