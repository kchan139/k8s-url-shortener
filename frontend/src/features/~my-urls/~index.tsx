import { createFileRoute } from '@tanstack/react-router';
import * as QRCode from 'qrcode';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import ConfirmModal from '@/components/ui/confirm-modal/confirm-modal';
import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import ModalWrapper from '@/components/ui/modal/modal-wrapper';
import Section from '@/components/ui/section-wrapper';
import { handleAxiosError } from '@/helpers/handle-axios-error';
import UrlsService from '@/services/urls.service';
import useAuthStore from '@/store/use-auth-store';
import { ShortenedUrl } from '@/types/url';

import UrlList from '../components/url-list';

export const Route = createFileRoute('/my-urls/')({
  component: MyURLs,
});

function MyURLs() {
  const { user } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [focusHash, setFocusHash] = useState<string | null>(null);
  const [isQrModalOpen, setQrModalOpen] = useState(false);

  const [newHash, setNewHash] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [urlsList, setUrlsList] = useState<Array<ShortenedUrl>>([]);
  const [loading, setLoading] = useState(false);
  const size = 10;

  const generateQrDataUrl = (url: string) => {
    QRCode.toDataURL(
      url,
      {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      },
      (error, dataUrl) => {
        if (error) return;

        setQrDataUrl(dataUrl);
      },
    );
  };

  const downloadQr = () => {
    if (!qrDataUrl || !focusHash) {
      toast.error('There is no QR to download!');
      return;
    }

    const link = document.createElement('a');
    link.download = `bklink-${focusHash}.png`;
    link.href = qrDataUrl;
    link.click();
    document.removeChild(link);
  };

  const onClickOpenQrModal = (url: string) => {
    if (loading) {
      toast.error('An action is in progress ...');
      return;
    }
    generateQrDataUrl(url);
    setFocusHash(url);
    setQrModalOpen(true);
  };

  const onClickCloseQrModal = () => {
    if (loading) {
      toast.error('An action is in progress ...');
      return;
    }

    setQrModalOpen(false);
    setFocusHash(null);
    setQrDataUrl(null);
  };

  const onClickOpenEditModal = (hash: string) => {
    setIsEditModalOpen(true);
    setFocusHash(hash);
  };

  const onClickCloseEditModal = () => {
    if (loading) {
      toast.error('An action is in progress ...');
      return;
    }
    setIsEditModalOpen(false);
    setNewHash('');
    setFocusHash(null);
  };

  const onChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewHash(e.target.value);
  };

  const onClickOpenDeleteModal = (hash: string) => {
    setFocusHash(hash);
    setIsDeleteModalOpen(true);
  };

  const onClickCloseDeleteModal = () => {
    if (loading) {
      toast.error('An action is in progress ...');
      return;
    }
    setIsDeleteModalOpen(false);
    setFocusHash(null);
  };

  const getAllUrls = useCallback(async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        toast.error('No user at the moment. Please login!');
        setLoading(false);
        return;
      }
      const { data } = await UrlsService.getAllUrlsUser(
        user?.id,
        'all',
        page,
        size,
      );
      setTotalPages(data.totalPages);
      setUrlsList(data.items);
    } catch (error: unknown) {
      handleAxiosError(
        error,
        (message) => toast.error(message),
        'Can not shorten URL!',
      );
    } finally {
      setLoading(false);
    }
  }, [page, size, user?.id]);

  useEffect(() => {
    getAllUrls();
  }, [getAllUrls]);

  const editAlias = async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        toast.error('No user at the moment. Please login!');
        setLoading(false);
        return;
      }
      if (!focusHash) {
        toast.error('No URL selected at the moment. Please select a URL!');
        setLoading(false);
        return;
      }
      await UrlsService.updateUrlByHashUser(user.id, focusHash, newHash);
      await getAllUrls();
      toast.success('Url alias has been updated!');
      onClickCloseEditModal();
    } catch (error: unknown) {
      handleAxiosError(
        error,
        (message) => toast.error(message),
        'Can not update URL!',
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteUrl = async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        toast.error('No user at the moment. Please login!');
        setLoading(false);
        return;
      }
      if (!focusHash) {
        toast.error('No URL selected at the moment. Please select a URL!');
        setLoading(false);
        return;
      }
      await UrlsService.deleteUrlByHashUser(user.id, focusHash);
      await getAllUrls();
      toast.success('Url alias has been deleted!');
      onClickCloseDeleteModal();
    } catch (error: unknown) {
      handleAxiosError(
        error,
        (message) => toast.error(message),
        'Can not delete URL!',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex w-full flex-col">
      <Header />
      <ConfirmModal
        loading={loading}
        show={isDeleteModalOpen}
        close={onClickCloseDeleteModal}
        title="Delete URL"
        onConfirm={deleteUrl}
        onCancel={onClickCloseDeleteModal}
        confirmButtonText="Delete"
        isPositive={false}
        children={
          <div className="flex flex-col gap-4">
            <p>
              https://url-shortener-be-production-aa52.up.railway.app/
              <span className="font-bold">{focusHash}</span>?r=Facebook
            </p>
            <p>
              The selected shortened URL will be deleted forever and can no
              longer be accessed by any means!
            </p>
          </div>
        }
      />

      <ConfirmModal
        show={isEditModalOpen}
        loading={loading}
        close={onClickCloseEditModal}
        title="Customize alias"
        onConfirm={editAlias}
        onCancel={onClickCloseEditModal}
        confirmButtonText="Confirm"
        isPositive={true}
        children={
          <div className="flex flex-col gap-4">
            <p>
              https://url-shortener-be-production-aa52.up.railway.app/
              <span className="font-bold">{focusHash}</span>?r=Facebook
            </p>

            <form>
              <input
                id="email"
                name="email"
                type="text"
                onChange={onChangeUrl}
                placeholder="Enter a new alias"
                value={newHash}
                className="w-full rounded border border-solid p-3 focus:border-primary"
              />
            </form>

            <p>This action can not be be reversed! </p>
          </div>
        }
      />

      {/* QR URL modal */}
      <ModalWrapper show={isQrModalOpen} close={onClickCloseQrModal}>
        <div className="relative mb-16 mt-10 flex flex-col items-center gap-4 rounded-lg bg-white p-5 xl:mt-0 xl:items-start">
          <div className="relative flex flex-row gap-10">
            <div className="relative flex max-w-80 flex-col gap-5">
              <div className="text-[24px] font-bold">Generate QR Code</div>
              <div>{focusHash}</div>
            </div>
            <img
              alt="QR code"
              src={qrDataUrl || ''}
              className="relative aspect-square w-80 rounded-lg xs:w-[25rem] sm:w-[30rem] lg:w-[35rem] xl:w-80 2xl:w-72"
            />
          </div>
          <div className="flex w-full flex-row gap-5">
            <button
              onClick={onClickCloseQrModal}
              className="w-full rounded-lg border border-solid border-[#303030] px-4 py-2 text-[#303030] duration-200 ease-in-out hover:bg-[#303030] hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={downloadQr}
              className="w-full rounded-lg border border-solid border-primary bg-primary px-4 py-2 text-white duration-200 ease-in-out hover:bg-primary-700"
            >
              Save QR
            </button>
          </div>
        </div>
      </ModalWrapper>

      <img
        alt="Background"
        src="/images/background-statistics.png"
        className="absolute h-screen object-cover object-center lg:w-screen"
      />
      <Section>
        <UrlList
          onClickOpenQrModal={onClickOpenQrModal}
          urlsList={urlsList}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          loading={loading}
          onClickOpenModal={onClickOpenDeleteModal}
          onClickOpenEditModal={onClickOpenEditModal}
        />
      </Section>
      <Footer />
    </div>
  );
}
