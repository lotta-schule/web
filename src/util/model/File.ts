import {
    FileModel,
    FileModelType,
    DirectoryModel,
    UserModel,
    FileConversionModel,
} from 'model';
import { createImageUrl } from 'util/image/useImageUrl';
import { User } from './User';

export const File = {
    getPreviewImageLocation(baseUrl: string, file?: FileModel, size = 200) {
        if (file) {
            if (file.fileType === FileModelType.Image) {
                return createImageUrl(
                    File.getFileRemoteLocation(baseUrl, file),
                    { width: size, aspectRatio: '4:3', resize: 'cover' }
                );
            } else {
                const imageConversionFile = file.fileConversions?.find((fc) =>
                    /^gif/.test(fc.format)
                );
                if (imageConversionFile) {
                    return createImageUrl(
                        File.getFileConversionRemoteLocation(
                            baseUrl,
                            imageConversionFile
                        ),
                        { width: size, aspectRatio: '4:3', resize: 'cover' }
                    );
                }
            }
        }
        return null;
    },

    canEditDirectory(
        directory: DirectoryModel,
        user: UserModel | null | undefined
    ) {
        return user && (directory.user?.id === user.id || User.isAdmin(user));
    },

    canCreateDirectory(
        directory: DirectoryModel,
        user: UserModel | null | undefined
    ) {
        if (directory.id === null) {
            return true; // Is a root directory
        }
        return this.canEditDirectory(directory, user);
    },

    getFileRemoteLocation(baseUrl: string, file: FileModel, qs: string = '') {
        return [baseUrl, 'api', 'storage', 'f', file.id]
            .join('/')
            .concat(qs ? `?${qs}` : '');
    },

    getFileConversionRemoteLocation(
        baseUrl: string,
        fileConversion: FileConversionModel
    ) {
        return [
            baseUrl,
            'api',
            'backend',
            'storage',
            'fc',
            fileConversion.id,
        ].join('/');
    },
};
