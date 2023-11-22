import { UserRecever } from '@/app/account/Entity/UserRecever';
import { cookies, headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { HandleProfessorWorkout } from '../../HandleProfessorWorkout';
import { UploadVideo } from './UploadVideo';

export default async function VideoPage(){

    if (!await HandleProfessorWorkout.getId()) {
      notFound();
    }
    return<>
    <UploadVideo />
    </>
}