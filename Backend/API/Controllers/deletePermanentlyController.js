const cron = require('node-cron');
const { Op } = require('sequelize');
const Task = require('../../Database/Models/task'); 

// Function to delete soft-deleted tasks older than 30 days
const deleteOldSoftDeletedTasks = async () => {
    try {
        const currentTime = new Date();
        const thirtyDaysAgo = new Date(currentTime.getTime() - 30 * 24 * 60 * 60 * 1000); 

        const deletedTasks = await Task.destroy({
            where: {
                isDelete: true,
                deletedAt: {
                    [Op.lt]: thirtyDaysAgo 
                }
            }
        });

        if (deletedTasks > 0) {
            console.log(`${deletedTasks} old soft-deleted task have been permanently deleted.`);
        }
    } catch (error) {
        console.error('Error deleting old soft-deleted tasks:', error);
    }
};

// Schedule the job to run once a day
cron.schedule('0 0 * * *', deleteOldSoftDeletedTasks); 