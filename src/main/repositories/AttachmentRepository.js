import { GridFsAttachmentRepository } from './GridFsAttachmentRepository'

/**
 * Main attachment repository provider wrapper.
 * By using this wrapper, other layers only refer to AttachmentRepository.
 * If we need to migrate storage provider in the future, we only need to switch the import here.
 */
export const AttachmentRepository = GridFsAttachmentRepository
