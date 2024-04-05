import { ReactNode, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from './modal';

interface FormModalProps {
	isOpen: boolean;
	onClose: () => void;
	// onConfirm: () => void;
	// loading: boolean;
	children: ReactNode; // Accept any form component as children
	description?: string;
	title?: string;
}

export const FormModal: React.FC<FormModalProps> = ({
	isOpen,
	onClose,
	// onConfirm,
	// loading,
	children,
	description,
	title,
}) => {
	return (
		<Modal
			title={title || ''}
			description={description || ''}
			isOpen={isOpen}
			onClose={onClose}
		>
			{/* <div className="pt-6 space-x-2 flex items-center justify-end w-full">
				<Button disabled={loading} variant="outline" onClick={onClose}>
					Cancel
				</Button>
				<Button disabled={loading} variant="destructive" onClick={onConfirm}>
					Continue
				</Button>
			</div> */}
			{children}
		</Modal>
	);
};
