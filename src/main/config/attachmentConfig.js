/**
 * Centralized Storage and Attachment Configuration for Main Process
 */
export const ATTACHMENT_CONFIG = {
  // Max size per uploaded file: 10 MB
  maxFileSize: 10 * 1024 * 1024,

  // Maximum number of files attached to a single media record: 10
  maxFileCount: 10,

  // Maximum total size of all attachments for a single media record: 30 MB
  maxTotalSize: 30 * 1024 * 1024,

  // Total available database attachment storage limit: 512 MB (Atlas Free Tier)
  totalStorageLimit: 512 * 1024 * 1024
}
